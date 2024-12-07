import os
import pandas as pd
import json
import numpy as np
from pymongo import MongoClient
from datetime import datetime

#função para ler os arquivos csv
def load_tables_to_dataframes():
    try:
        avaliacoes = pd.read_csv('data/avaliacao.csv',)
        obras = pd.read_csv('data/obras.csv',usecols=['tconst','titleType','originalTitle','startYear','runtimeMinutes','genres'],)
        profissao = pd.read_csv('data/profissao.csv',usecols=['tconst','primaryName_x'],)
        filmes_regiao = pd.read_csv('data/filmes_regiao.csv',usecols=['tconst','country'],)
    except Exception as e:
        print(f"Erro ao carregar os arquivos: {e}")
        return None

    return {
        'avaliacao': avaliacoes,
        'obras': obras,
        'profissao': profissao,
        'filmes_regiao': filmes_regiao
    }

#função para fazer tratamento e processamento dos dados
def data_organizer(dataframes):
    avaliacoes, obras, profissao, filmes_regiao = (dataframes.get(key) for key in ['avaliacao', 'obras', 'profissao', 'filmes_regiao'])
    obras = obras[obras['startYear'] >= 2015]
    obras=obras[obras['titleType']=='movie']
    obras = obras.drop('titleType', axis=1)
    filmes_regiao['country'] = filmes_regiao['country'].fillna('')
    combined=obras.merge(filmes_regiao,on='tconst',how='left')
    profissao = profissao.groupby('tconst')['primaryName_x'].apply(lambda x: [val for val in x if pd.notna(val)]).reset_index()
    avaliacoes=avaliacoes.rename(columns={'averageRating':'Avaliacao_media','numVotes':'Qtd_votos'})
    avaliacoes = avaliacoes.set_index('tconst').apply(lambda row: row.to_dict(), axis=1).reset_index()
    avaliacoes.rename(columns={0: 'classificações'}, inplace=True)
    combined=combined.merge(avaliacoes,on='tconst',how='left')
    combined=combined.merge(profissao,on='tconst',how='left')
    combined["genres"] = combined["genres"].str.split(',')
    combined=pryce_generator(combined)
    combined=combined.rename(columns={'originalTitle': 'Título', 'startYear': 'Ano_inicio','runtimeMinutes':'Duração', 'genres':'generos','country':'região','primaryName_x':'diretores'})
    combined['Título']=combined['Título'].str.replace('#','')
    combined['capa']='https://one-cinema.s3.sa-east-1.amazonaws.com/filmes/ainda-estou-aqui/13112024/342/capa-ainda-estou-aqui.jpg'
    combined=combined.to_dict(orient='records')
    clean_dict_list_in_place(combined)
    return combined

#função para apagar atributos vazios
def clean_dict_list_in_place(dict_list):
    for record in dict_list:  # Itera sobre cada dicionário na lista
        keys_to_remove = set() 
        
        for key, value in record.items():  
            if not isinstance(value,list) and pd.isna(value): 
                keys_to_remove.add(key)  # Marca a chave para remoção
            if not value:
                keys_to_remove.add(key)  
        for key in keys_to_remove:
            del record[key]
    print('executei com sucesso')

#função que cria a lógica utilizada para gerar os preços
def pryce_generator(df):
    base_prices = 7+ (df['startYear'] - 2015)  
    random_increments = np.random.uniform(
        df['startYear'] - 2015, df['startYear'] - 2014, size=len(df)
    )  

    df['preco'] = (base_prices + random_increments).round(2)

    return df
#função para carregar os dados no mongo
def data_loader(data):
    try:
        client = MongoClient('mongodb+srv://admin:JpugL667QSKY6G3P@imdb.is7ox.mongodb.net/')  
        db = client['imdb']  
        collection_name = 'filmes'  
        collection = db[collection_name]

        if collection_name in db.list_collection_names():
            collection.drop()
            print(f"A coleção '{collection_name}' foi apagada.")

        result = collection.insert_many(data)
        print(f"{len(result.inserted_ids)} documentos inseridos com sucesso no MongoDB.")

    except Exception as e:
        print(f"Erro ao carregar os dados no MongoDB: {e}")

    finally:
        client.close()

#função para salvar um arquivo em json (para testes)
def salva_json(data):
    with open('resultado.json', 'w', encoding='utf-8') as arquivo:
        json.dump(data, arquivo, indent=4, ensure_ascii=False)

dfs=load_tables_to_dataframes()
df=data_organizer(dfs)
#salva_json(df)
data_loader(df)
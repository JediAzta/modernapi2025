import  { MongoClient, ServerApiVersion } from 'mongodb';
const uri = 'mongodb+srv://sampleuser:1234567890@cluster0.mtnbj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

export const find: any = async ( collectionName: string, query: any) =>{
    let values: any;
    try {
        await client.connect();
        const db = client.db('sampledb');
        const collection = db.collection(collectionName);
        values = await collection.find(query).toArray();
    } catch(error) {
        values = error;
    } finally {
        await client.close();
    }
    return values;
}
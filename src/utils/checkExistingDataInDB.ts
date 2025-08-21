import { Model, ModelStatic } from "sequelize";

export default async function checkExistingDataInDB(
    ModelClass: ModelStatic<Model>,
    id: number,
    name: string
): Promise<Model> {
    try {
        if (!id) {
            throw new Error(`${name} id is required`);
        }
        const record = await ModelClass.findByPk(id);
        if (!record) {
            throw new Error(`${name} not found`);
        }
        return record;
    } catch (error) {
        console.error(`Error in checkExistingDataInDB: ${error}`);
        throw new Error(`Error in checkExistingDataInDB: ${error}`);
    }
}

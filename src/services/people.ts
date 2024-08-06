import { Prisma, PrismaClient } from "@prisma/client";
import * as groups from '../services/groups'

const prisma = new PrismaClient()

type GetAllPeople = {id_event: number, id_group?: number}
export const getAll = async (filter: GetAllPeople)=>{
    try {
        return await prisma.eventPeople.findMany({
            where: filter
        })
    } catch (error) {
        return false;
    }
}

type GetOnePerson = {id_event: number, id_group?: number, id?: number; cpf?:string}
export const getPerson = async (filter: GetOnePerson)=>{
    try {
        if(!filter.cpf && !filter.id) return false;

        return await prisma.eventPeople.findFirst({where: filter})
    } catch (error) {
        return false
    }
};

type createPeopleData = Prisma.Args<typeof prisma.eventPeople, 'create'>['data']


export const addPerson = async (data: createPeopleData)=>{
    try {
        if( !data.id_group) return false;

        const group = await groups.getGroup({
            id: data.id_group,
            id_event: data.id_event
        })

        if (!group) return false

        return await prisma.eventPeople.create({data})
    } catch (error) {
        return false
    }
}


type UpdatePeopleData = Prisma.Args<typeof prisma.eventPeople, 'update'>['data']
type UpdateFiltersData = {id_event: number; id_group?: number; id?:number}

export const updatePerson = async (filter: UpdateFiltersData, data: UpdatePeopleData)=>{
    try {
        return await prisma.eventPeople.updateMany({
            where: filter, data
        })
    } catch (error) {
        return false
    }
}

type DeletType = {
    id_event?: number,
     id_group?: number,
     id: number 
}
export const remove = async (filter: DeletType) =>{
    try {
        return await prisma.eventPeople.delete({
            where: filter
        })
    } catch (error) {
        return false
    }
}
import { PrismaClient, Prisma } from "@prisma/client"
import * as events from '../services/events'

const prisma = new PrismaClient()

export const getAll = async (id: number) => {
    try {
        return await prisma.eventGroup.findMany({
            where: {
                id_event: id
            }
        })
    } catch (error) {
        return false
    }
}


type GetOneFilters = {
    id: number,
    id_event: number
}
export const getGroup = async (filters: GetOneFilters) => {
    try {
        return await prisma.eventGroup.findFirst({
            where: filters
        })
    } catch (error) {
        return false
    }
}

type GroupCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data']
export const add = async (data: GroupCreateData) => {

    try {
        if (!data.id_event) return false;
        const eventItem = await events.getOne(data.id_event);
        if (!eventItem) return false;
        return await prisma.eventGroup.create({ data })
    } catch (error) {
        return false
    }
}
type GroupUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data']
type UpdateFilters = { id: number, id_event?: number }
export const update = async (filters: UpdateFilters, data: GroupUpdateData) => {
    try {
        return await prisma.eventGroup.update({ data, where: filters })
    } catch (error) {
        return false
    }
}

type DeleteFilters = { id: number; id_event?: number }
export const remove = async (filters: DeleteFilters) => {
    try {
        return await prisma.eventGroup.delete({
            where: filters
        })
    } catch (error) {
        return false
    }
}
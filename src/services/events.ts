import { Prisma, PrismaClient } from "@prisma/client"
import * as people from '../services/people'
import { encryptMatch } from "../utils/match";

const prisma = new PrismaClient();

export const getAll = async () => {
    try {
        return await prisma.event.findMany()
       
    } catch (error) {
        return false
    }
}

export const getOne = async (id:number)=>{
    try {
        return await prisma.event.findUnique({
            where: {
                id
            }
        })
    } catch (error) {
        return false
    }
}

type EventsCreateData = Prisma.Args<typeof prisma.event, 'create'>['data'] //tipagem do prisma para criar um evento

export const add = async (data: EventsCreateData)=>{
    try {
        return await prisma.event.create({
            data
        })
    } catch (error) {
        return false
    }
}
type EventsUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data'] //tipagem do prisma para atualizar um evento
export const update = async (id: number, data: EventsUpdateData)=>{
    try {
        return await prisma.event.update({
            data,
            where:{id}
        })
    } catch (error) {
        return false
    }
}

export const remove = async (id:number)=>{
    try {
        return prisma.event.delete({where:{
            id
        }})
    } catch (error) {
        return false
    }
}

export const doMatches = async (id: number): Promise<boolean> =>{
    const eventItem = await prisma.event.findFirst({where: {id}, select: {grouped: true}});

    if(eventItem){
        const peopleList = await people.getAll({ id_event: id});

        if(peopleList){
            let sortedList: {id: number, match: number} [] = [];
            let sortable: number [] = [];

            let attempts = 0;
            let maxAttempts = peopleList.length;
            let keepTrying = true;

            while (keepTrying && attempts < maxAttempts) {
                keepTrying = false;
                attempts++;
                sortedList = [];
                sortable = peopleList.map(item=> item.id)

                for (let i in peopleList){
                    let sortableFiltered: number[] = sortable;

                    if(eventItem.grouped) {
                        sortableFiltered = sortable.filter(sortableItem => {
                            let sortablePerson = peopleList.find(item => item.id === sortableItem);
                            return peopleList[i].id_group !== sortablePerson?.id_group
                        })
                    }

                    if (sortableFiltered.length === 0 || (sortableFiltered.length === 1 && peopleList[i]. id === sortableFiltered[0] )){
                        keepTrying = true;
                    } else{
                        let sortedIndex = Math.floor(Math.random() * sortableFiltered.length);

                        while(sortableFiltered[sortedIndex] === peopleList[i].id){
                            sortedIndex = Math.floor(Math.random() * sortableFiltered.length)
                        }

                        sortedList.push({
                            id: peopleList[i].id,
                            match: sortableFiltered[sortedIndex]
                        })

                        sortable = sortable.filter(item => item !== sortableFiltered[sortedIndex])
                    }
                }
            }

            console.log(`ATTEMPTS: ${attempts}`);
            console.log(`MAX ATTEMPS: ${maxAttempts}`);
            console.log(sortedList)

            if(attempts < maxAttempts){
                for (let i in sortedList){
                    await people.updatePerson({
                        id: sortedList[i].id,
                        id_event: id
                    }, {matched: encryptMatch(sortedList[i].match) })
                }
                return true
            }
        }
    }
    return false; //temporário
}
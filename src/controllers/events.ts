import { RequestHandler } from "express";
import * as events from '../services/events'
import * as people from '../services/people'
import { z } from "zod";
import { group } from "console";

export const getAll: RequestHandler = async (req, res) => {
    const itens = await events.getAll();

    if (!itens) {
        return res.json({ error: "Erro ao buscar os dados" })
    }
   return res.json({ events: itens })
};

export const getEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const eventItem = await events.getOne(parseInt(id));

    if (eventItem) {
        return res.json({ event: eventItem })
    }
   return res.json({ error: 'Ocorreu um erro ao buscar os dados' })
};

export const addEvent: RequestHandler = async (req, res) => {
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    })

    const body = addEventSchema.safeParse(req.body);

    if (!body.success) {
        return res.json({ error: "Dados inválidos" })
    }

    const newEvent = await events.add(body.data)

    if (newEvent) {
        return res.status(201).json({ event: newEvent })
    }

   return res.json({ error: 'Ocorreu erro ao criar evento' })
}

export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;

    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    })

    const body = updateEventSchema.safeParse(req.body);

    if (!body.success) {
        return res.json({ error: "Dados inválidos" })
    }

    const updatedEvent = await events.update(parseInt(id), body.data)

    if (updatedEvent) {

        if (updatedEvent.status) {
            
            const result = await events.doMatches(parseInt(id))
            if(!result){
                return res.json({error: "Grupos impossíveis de sorterar"});
            }
        } else {
           await people.updatePerson({id_event: parseInt(id)}, {matched: ''})
        }


        return res.json({ Event: updatedEvent })
    }

    res.json({ error: "Erro ao atualizar evento" })
}

export const deletEvent: RequestHandler = async (req, res)=>{
    const {id} = req.params;

    const deletedEvent = await events.remove(parseInt(id))

    if (deletedEvent){
        return res.json({event: deletedEvent})
    }

   return res.json({error: "Ocorreu um erro ao deletar evento"})
}
import { RequestHandler } from "express";
import * as groups from '../services/groups'
import { z } from "zod";


export const getAll: RequestHandler = async (req, res)=>{
    const {id_event} = req.params

    const itens = await groups.getAll(parseInt(id_event))

    if(itens){
       return res.json({groups: itens})
    }

   return res.json({error: "Erro ao listar grupos"})
}

export const getGroup: RequestHandler = async (req, res)=>{
    const {id_event, id} =  req.params;
    const itemGroup = await groups.getGroup({
        id: parseInt(id),
        id_event: parseInt(id_event)
    })
    if(itemGroup){
        res.json({group: itemGroup})
    }
   return res.json({error: "Erro ao listar grupo"})
}

export const addGroup: RequestHandler = async (req, res)=>{
    const {id_event} = req.params
    const groupSchema = z.object({
        name: z.string()
    })
    const body = groupSchema.safeParse(req.body)

    if(!body.success){
        return res.json({error: "Dados inválidos"})
    }
    const newGroup = await groups.add({
        name: body.data.name,
        id_event: parseInt(id_event)
    })

    if(newGroup){
        return res.status(201).json({group: newGroup})
    }

   return res.json({error: "Erro ao criar grupo"})
}

export const updateGroup: RequestHandler = async (req, res)=>{
    const {id_event, id} = req.params;

    const updateSchema = z.object({
        name: z.string().optional()
    })

    const body = updateSchema.safeParse(req.body)

    if (!body.success){
       return res.json({error: "dados inválidos"})
    }

    const updatedGroup = await groups.update({
        id: parseInt(id),
        id_event: parseInt(id_event),
    },body.data);

    if(updatedGroup){
        return res.json({group: updatedGroup})
    }

   return res.json({error: "Erro ao atualizar group"})
}

export const deletGroup: RequestHandler = async (req, res)=>{
    const {id_event, id} = req.params;

    const deletedGroup = await groups.remove({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });

    if(deletedGroup){
       return res.json({group: deletedGroup})
    }

   return res.json({error: "Ocorreu um erro ao deletar um grupo"});
}


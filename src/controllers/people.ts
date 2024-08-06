import { RequestHandler } from "express";
import * as people from '../services/people'
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params

    const itens = await people.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })

    if (itens) {
        return res.json({ people: itens })
    }

    return res.json({ error: "Erro ao listar as pessoas" })
};

export const getPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params

    const item = await people.getPerson({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })

    if (item) {
        return res.json({ person: item });
    }

    return res.json({ error: "Erro ao listar pessoa" })
}

export const addPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const peopleSchema = z.object({
        name: z.string(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')),

    })

    const body = peopleSchema.safeParse(req.body);

    if (!body.success) {
        return res.json({ error: "Dados inválidos" })
    }

    const newPerson = await people.addPerson({
        name: body.data.name,
        cpf: body.data.cpf,
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)

    })

    if (newPerson) {
        return res.json({ person: newPerson })
    }
    return res.json({ error: "Erro ao cadastrar nova pessoa" })
}

export const updatPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;

    const updatePersonSchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
        matched: z.string().optional()
    })

    const body = updatePersonSchema.safeParse(req.body);

    if (!body.success) {
       return res.json({ error: "Dados inválidos" })
    }

    const updatedPerson = await people.updatePerson({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    }, body.data)

    if(updatedPerson){
      const personItem = await people.getPerson({
        id: parseInt(id),
        id_event: parseInt(id_event)
      })

      return res.json({person: personItem})
    }

   return res.json({error: "Erro ao atualizar pessoa"})
}

export const deletePerson: RequestHandler = async (req, res)=>{
    const {id_event, id_group, id} = req.params;

    const deletedPerson = await people.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    })

    if(deletedPerson){
        return res.json({person: deletedPerson})
    }

    return res.json({error: "Erro ao deletar usuários"})
}

export const searchPerson: RequestHandler = async (req, res)=>{
    const {id_event} = req.params

    const searchPersonSchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|-/gm, ''))
    });

    const query = searchPersonSchema.safeParse(req.query)

    if(!query.success){
        return res.json({error: "Dados inválidos"})
    };

    const personItem = await people.getPerson({
        id_event: parseInt(id_event),
        cpf: query.data.cpf,        
    });

    if( personItem && personItem.matched){
        const matchId = decryptMatch(personItem.matched);

        const personMatched = await people.getPerson({
            id_event: parseInt(id_event),
            id: matchId
        })

        if(personMatched) {
            return res.json({
                person: {
                    id: personItem.id,
                    name: personItem.name
                },
                personMatched: {
                    id: personMatched.id,
                    name: personMatched.name
                }
            })
        }
    }

    return({error: "Ocorreu erro ao localizar cpf"})
}
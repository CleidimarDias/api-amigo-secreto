import { getToday } from "../utils/getToday"

export const validatePassword = (password: string):boolean=>{
    const currentePassword = getToday().split('/').join('');   
    return password === currentePassword;
}

export const createToken = ()=>{
    const currentePassword = getToday().split('/').join('');
    return `${process.env.DEFAULT_TOKEN}${currentePassword}`
}

export const validateToken = (token: string)=>{
    const currentToken = createToken();
    return token === currentToken;
}
import { Context } from "koa";
import { users } from "../models/users";
import { validationResults } from "koa-req-validation";

export const basicAuthMiddleWare = async (ctx: Context, next: any) => {
    const authHeader = ctx.request.headers.authorization;   // Take out the authorization pack from the header
    if(!authHeader || !authHeader.startsWith('Basic ')) {   // If authorization pack not found / not start from 'Basic '
        ctx.status = 401;                                   // Return 401
        ctx.headers['www-authenticate'] = 'Basic realm="Secure Area"';  // optional (recommend add)
        ctx.body = {msg: 'Authorization required'};
    } else {
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString(); // Decrypt the string
        const [username, password] = auth.split(':');                            // split the username and password
        console.log(`${username} is trying to access`);                                              
        if(validationCredentials(username, password)) {                          //check if the username password correct
            ctx.state.user = { username };
        } else {
            ctx.status = 401;
            ctx.body = {msg: 'Authorization failed'};
        }
    }
    await next();
}

const validationCredentials = (username: string, password: string): boolean => {    // Internal function check u/p
    let result = false;
    users.forEach((user)=> {
        if (user.username === username && user.password === password) {
            result = true;
        }
    });
    return result;
}
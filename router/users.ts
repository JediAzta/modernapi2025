import Router, { RouterContext } from 'koa-router';
import {users} from '../models/users';
import { basicAuthMiddleWare } from '../controllers/authMiddleware';


const router: Router = new Router({prefix: '/api/v1/users'});

const getUser = async(ctx: RouterContext, next: any) => {
    if(ctx.state.user===undefined) {
        ctx.status = 401;
        ctx.body = { msg: 'Authorization failed'};
    } else {
        users.forEach((user) => {
            if(user.username === ctx.state.user.username) {
                ctx.body = user;
            }
        });
    }
    await next();
}

router.get('/auth', basicAuthMiddleWare, getUser);

export { router };

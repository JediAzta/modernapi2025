import Koa from 'koa';
import Router, { RouterContext } from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import { router as articles } from './router/articles';
import { router as users } from './router/users';
import bodyParser from 'koa-bodyparser';

const app: Koa= new Koa();
const router: Router = new Router();

const welcomeAPI = async (ctx: RouterContext, next: any) =>{
    ctx.body = {
        message: 'Welcome to the Blog API'
    }
}

router.get ('/api/v1', welcomeAPI);
app.use(logger());
app.use(json());
app.use(bodyParser());
app.use(router.routes());
app.use(articles.routes());
app.use(users.routes());

app.listen(10888, () => {
    console.log('Blog API started');
});
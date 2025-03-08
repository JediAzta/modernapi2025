import Router, { RouterContext } from 'koa-router';
import { CustomErrorMessageFunction, body, validationResults } from 'koa-req-validation';
import * as db from '../helpers/dbhelpers';
import { basicAuthMiddleWare } from '../controllers/authMiddleware';

const router: Router = new Router({prefix: '/api/v1/articles'});
const articles = [
    { title: 'Title 1', fullText: 'This is title 1 content.'},
    { title: 'Title 2', fullText: 'This is title 2 content.'},
    { title: 'Title 3', fullText: 'This is title 3 content.'},
];

// Lab 3, Section 5)
const customErrorMsg: CustomErrorMessageFunction = (ctx: RouterContext, value: string) => {
    return (`The body content is not correct.`);
}
const validatorName = [
    body("title").isLength({min: 5}).withMessage(customErrorMsg).build(),
    body("fullText").isLength({min: 5}).withMessage(customErrorMsg).build(),
];


const getAll = async(ctx: RouterContext, next: any) => {
    // check if ctx.state is valid
    if(ctx.status !== 401) {                                    // If not 401, that mean auth passed                
        if(ctx.state.user.username === 'admin') {               // if admin, show all articles
            const articlesdb = await db.find('articles', {});
            ctx.body = articlesdb;    
        } else {                                                // otherwise, return unauthorized
            ctx.status = 401;
            ctx.body = { msg: 'unauthorized'}
        }
    }
    await next();
}

const getById = async(ctx: RouterContext, next: any) =>{
    const id = +ctx.params.id;
    if(id<articles.length){
        ctx.body = articles[id];
    } else {
        ctx.status=404;
        ctx.body = {};
    }
    await next();
}

const add = async(ctx: RouterContext, next: any) => {
    const validationResult = validationResults(ctx);
    if(validationResult.hasErrors()){
        ctx.status = 422;
        ctx.body = { err: validationResult.mapped()}   // Return custom defined error
    } else {
        const newArticles: any = ctx.request.body;
        articles.push(newArticles); 
        ctx.status = 200;
        ctx.body = { msg: 'new article added'};
    }
    await next();
}

const updateArticle = async (ctx: RouterContext, next: any) => {
    const validationResult = validationResults(ctx);
    if(validationResult.hasErrors()){
        ctx.status = 422;
        ctx.body = { err: validationResult.mapped()}   // Return custom defined error
    } else {
        const article: any = ctx.request.body;
        const id = +ctx.params.id;
        if(id<articles.length){
            articles[id] = article;
            ctx.status = 200;
            ctx.body = { msg: `article #${id} updated`}
        } else {
            ctx.status=404;
            ctx.body = {};
        }
    }
    await next();
}
const deleteArticle = async (ctx: RouterContext, next: any) => {
    const id = +ctx.params.id;
    if(id<articles.length){
        articles.splice(id, 1);
        ctx.body = { msg: 'article deleted'}
    } else {
        ctx.status=404;
        ctx.body = {};
    }
    await next();
}

router.get('/', basicAuthMiddleWare, getAll); // Get all articles
router.get('/:id', getById); // Get one article (variable id)
router.post('/', ...validatorName,  add); // Create a new article
router.put('/:id', ...validatorName,  updateArticle); // Update an article (variable id)
router.delete('/:id', deleteArticle); // Delete an article (variable id)

export { router }
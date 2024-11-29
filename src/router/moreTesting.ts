import { Request, Response, Router } from 'express';

const moreTestingRouter: Router = Router();

moreTestingRouter.post('/places/:id/votes', (req: Request, res: Response) => {
    const { votes, userId } = req.body;
    // Process the votes into a table of some sort
    console.log(votes);
    console.log(userId);
    res.status(200).json({"message": "success"});
})

export default moreTestingRouter;
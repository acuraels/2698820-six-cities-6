import {type Router} from 'express';

export interface ControllerInterface {
  getRouter(): Router;
}

import Token from './Token';
import Posting from './Posting';

export default class Index {
    public map : Map<Token, Posting> = new Map();
}
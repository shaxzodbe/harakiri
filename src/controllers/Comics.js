import Api from "./Api";

class Comics extends Api {
    constructor() {
        super();

    }

    async getComics() {
        return await this.post({type:"get_comics"})

    }
}

export default Comics
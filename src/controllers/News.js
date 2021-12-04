import Api from "./Api";


class News extends Api {
    userId;

    constructor() {
        super();
    }

    async getNews(data) {
        data.type = "get_news";
        data.user_id = this.userId;
        return await this.post(data)
    }
    async getNew(data){
        data.type="get_new"
        data.user_id = this.userId;
        return await this.post(data)
    }
    async saveNew(data) {
        data.type = "add_news";
        data.user_id = this.userId;
        return await this.post(data)
    }

}

export default News;
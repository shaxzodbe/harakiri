import Api from "./Api";


class Manga extends Api {
    userId;

    constructor() {
        super();
    }

    add_View(user_id, manga_id) {
        this.post({type: "add_view", user_id: user_id, manga_id: manga_id})
    }

    getUpdate = async (manga_id) => {
        let r = await this.post({type: "get_manga", manga_id: manga_id, user_id: this.userId})
        return r;
    }
    addArticle = async (data) => {
        data.type = "add_article"
        data.user_id = this.userId;
        let r = await this.post(data)
        return r;
    }
    addRating = async (data) => {
        data.type = "add_rating";
        data.user_id = this.userId;
        let r = await this.post(data)
        return r;
    }
    addToFavorit = async (data) => {
        data.type = "add_to_favorite";
        data.user_id = this.userId;
        let r = await this.post(data)
        return r;
    }
    addComment = async (data) => {
        data.type = "add_comment";
        data.user_id = this.userId;
        await this.post(data)

    }
    likeComment = async (data) => {
        data.type = "like_comment"
        data.user_id = this.userId;
        return await this.post(data)
    }
    getCommentsfForRead = async (data) => {
        data.type = "get_comments_read"
        data.user_id = this.userId;
        return await this.post(data)
    }
    addLikeManga = async (data) => {
        data.type = "add_like_to_manga"
        data.user_id = this.userId;
        return await this.post(data)
    }
    addNotif = async (data) => {
        data.type = "add_notif"
        data.user_id = this.userId;
        return await this.post(data)
    }
    addLikeToGlav = async (data) => {
        data.type = "add_like_glav"
        data.user_id = this.userId;
        return await this.post(data)
    }
    getLikesToGlavs = async (data) => {
        data.type = "get_likes_to_glavs"
        data.user_id = this.userId;
        return await this.post(data)
    }

    getNormalDate(date) {
        date = new Date(date)
        let month = date.getUTCMonth() + 1;
        let dated = date.getUTCDate();
        month = String(month).length === 1 ? "0" + month : month
        dated = String(dated).length === 1 ? "0" + dated : dated
        return `${dated}.${month}.${date.getUTCFullYear()}`
    }

    async getAllComics(data) {
        data.type = "get_all_comics"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async getUpdatedComcis(data) {
        data.type = "get_updated_comics"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async searchManga(data) {
        data.type = "search"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async getAllMangas(data) {
        data.type = "get_allMangas"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async getArticles(data) {
        data.type = "get_articles"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async articleResh(data) {
        data.type = "article_resh"
        data.user_id = this.userId;
        return await this.post(data)
    }

    getRaznicaDateOffline(date) {
        date = new Date(date);
        let now = new Date();
        if (now < date)
            return false;
        else
            return true;
    }

    async getRaznicaDate(date) {
        date = new Date(date);
        let data = {}
        data.type = "getRaznicaTime"
        data.user_id = this.userId;
        data.date = date;

        return await this.post(data)
    }

    async getAlerts(data) {
        data.type = "get_alerts"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async saveMomentView(data) {
        data.type = "save_moment"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async getContinue(data) {
        data.type = "get_cont"
        data.user_id = this.userId;
        return await this.post(data)
    }

    async updateManga(data) {
        data.type = "update_manga"
        data.user_id = this.userId;
        return await this.post(data)
    }
    async updateAvatarPls(avatar,manga_id){
        let data = {};
        data.type = "update_avatar"
        data.avatar = avatar;
        data.manga_id = manga_id;
        return await this.post(data)
    }
    async updateGlavPlease2(manga_id,persons,name,has_music,glav_id){
        let data = {};
        data.type = "update_glav2"
        data.user_id = this.userId;
        data.has_music = has_music;
        data.persons = persons;
        data.glav_id = glav_id;
        data.manga_id = manga_id;
        data.name = name;
        return await this.post(data)
    }
    async getManga(data){
        data.type = "get_by_name"
        return await this.post(data)
    }
    async updateGlavPlease(archive, glav_id, manga_id, what = null,path = null) {
        let data = {};
        data.type = "update_glav"
        data.user_id = this.userId;
        data.name_archive = archive;
        data.archive = path;
        data.music = what;
        data.glav_id = glav_id;
        data.manga_id = manga_id;
        return await this.post(data)
    }

    async deleteManga(data) {
        data.type = "delete_manga"
        data.user_id = this.userId;
        return await this.post(data)
    }

}

export default Manga;
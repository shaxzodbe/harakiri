import Api from "./Api";

class User extends Api{
    userId;
    constructor() {
        super();
    }
    //Ищем профиль
    async findProfile(fetchedUser,d = null){
        if(fetchedUser !== null)
        return await this.post({
            type: 'get_profile',
            user:fetchedUser,
            insert:true
        });
        else
            return await this.post({
                type: 'get_profile',
                user:d.fetchedUser,
                insert:false
            });
    }
    async getVip(data){
        data.type = "get_vip"
        data.user_id = this.userId;
        return await this.post(data)
    }
    async checkD(){
        return await this.post({
            type: 'ch_'
        });
    }
    async is_admin(id){
        return await this.post({
            type: 'is_admin',
            id:id
        });
    }
    async getRating(){
        return await this.post({
            type: 'get_rating'
        });
    }
    async look_ads(){
        return await this.post({
            type: 'look_ads',
            user_id:this.userId
        });
    }
    async setBorderAvatar(id){
        return await this.post({
            type: 'set_border',
            id:id,
            user_id:this.userId
        });
    }
    getMyFavorites = async (data) =>{
        data.type = "get_my_favorites"
        data.user_id = this.userId;
        return await this.post(data)
    }
    async updateDescription(data){
        data.type = "update_description"
        data.user_id = this.userId;
        return await this.post(data)
    }
    async getAllAdmins(data){
        data.type = "get_all_admins"
        data.user_id = this.userId;
        return await this.post(data)
    }
    async deleteAdmin(data){
        data.type = "delete_admin"
        data.user_id = this.userId;
        return await this.post(data)
    }
    async setAllowMes(data){
        data.type = "allow_mess"
        data.user_id = this.userId;
        return await this.post(data)
    }
}
export default User
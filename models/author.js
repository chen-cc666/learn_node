const mongoose  = require('mongoose');
// var moment = require('moment');
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
    {
        first_name:{type:String,required:true,max:100},
        family_name:{type:String,required:true,max:100},
        date_of_birth:{type:Date},
        date_of_death:{type:Date},
        // due_back:{type:Date,default:Date.now}
    },

);

//虚拟属性‘name’ :表示作者全名

AuthorSchema
    .virtual('name')
    .get(function (){
        return this.family_name  +  ',' + this.first_name;
    })

//虚拟属性‘lifespan’:作者寿命
//格式化日期
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        // return (this.data_of_death.getYear() - this.data_of_birth.getYear()).toString();
        // return this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
        // return this.due_back ? moment(this.due_back).format('YYYY,MMMM Do') : '';
        var lifetime_string = '';
        if (this.date_of_birth) {
            lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
        }
        lifetime_string += ' - ';
        if (this.date_of_death) {
            lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
        }
        return lifetime_string;


    });

// 虚拟属性 ‘url’：作者 URL

AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function() {
    return DateTime.fromJSDate(this.date_of_birth).toISODate(); //format 'YYYY-MM-DD'
});

AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function() {
    return DateTime.fromJSDate(this.date_of_death).toISODate(); //format 'YYYY-MM-DD'
});

// 导出Author 模型
module.exports = mongoose.model('Author',AuthorSchema);
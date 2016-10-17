module.exports = function(sequelize, DataTypes) {
    var Alerted = sequelize.define('alerted', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        username: DataTypes.STRING,
        twitch_id: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    }, {
        freezeTableName: true,
        tableName: "alerted"
    });
    return Alerted;
}
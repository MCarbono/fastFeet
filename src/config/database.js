module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'password',
  database: 'fastfeet',
  define: {
    timestamps: true,
    underscored: true,
    underscoreAll: true
  }
};

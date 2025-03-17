import Currency from "./Currency";
import Transaction from "./Transaction";
import Category from "./Category";

Currency.hasMany(Transaction, { foreignKey: "currency_id" });
Transaction.belongsTo(Currency, { foreignKey: "currency_id" });

Category.hasMany(Transaction, { foreignKey: "category_id" });
Transaction.belongsTo(Category, { foreignKey: "category_id" });

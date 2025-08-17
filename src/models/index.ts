import Currency from "./Currency";
import Transaction from "./Transaction";
import Category from "./Category";
import User from "./User";
import CurrencyHistory from "./CurrencyHistory";

// Встановлюємо асоціації
Transaction.belongsTo(Currency, { foreignKey: "currency_id" });
Currency.hasMany(Transaction, { foreignKey: "currency_id" });

Transaction.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Transaction, { foreignKey: "category_id" });

Transaction.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Transaction, { foreignKey: "user_id" });

export { Currency, Transaction, Category, User, CurrencyHistory };

import Currency from "./Currency";
import Transaction from "./Transaction";
import Category from "./Category";
import CurrencyHistory from "./CurrencyHistory";
import Debt from "./Debt";
import DebtPayments from "./DebtPayments";


Currency.hasMany(Transaction, { foreignKey: "currency_id" });
Transaction.belongsTo(Currency, { foreignKey: "currency_id" });

Category.hasMany(Transaction, { foreignKey: "category_id" });
Transaction.belongsTo(Category, { foreignKey: "category_id" });

Currency.hasMany(CurrencyHistory, { foreignKey: "currency_id" });
CurrencyHistory.belongsTo(Currency, { foreignKey: "currency_id" });
Currency.hasOne(CurrencyHistory, {
    foreignKey: "currency_id",
    as: "lastHistory",
});

Debt.hasMany(DebtPayments, { foreignKey: "debt_id" });
DebtPayments.belongsTo(Debt, { foreignKey: "debt_id" });
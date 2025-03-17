import { Category } from "../models";

class CategoryService {
	static async findById(id: number) {
		if (!id) {
			return {
				message: "Category is required",
				success: false,
			};
		}
		try {
			const category = await Category.findByPk(id);

			if (!category) {
				return {
					message: "Category not found",
					success: false,
				};
			}

			return {
				category,
				success: true,
			};
		} catch (error) {
			console.error("Error in findById", error);
			return {
				message: "Error in findById",
				error,
				success: false,
			};
		}
	}

	static async findByTitle(title: string) {
		if (!title) {
			return {
				message: "Title is required",
				success: false,
			};
		}
		try {
			const category = await Category.findOne({ where: { title } });

			if (!category) {
				return {
					message: "Category not found",
					success: false,
				};
			}

			return {
				category,
				success: true,
			};
		} catch (error) {
			console.error("Error in findByTitle", error);
			return {
				message: "Error in findByTitle",
				error,
				success: false,
			};
		}
	}

	static async create(title: string, icon: string, color: string) {
		const existCategory = await this.findByTitle(title);
		if (existCategory.success) {
			return {
				message: "Category with this title already exists",
				success: false,
			};
		}

		try {
			const category = await Category.create({
				title,
				icon,
				color,
			});

			return {
				message: "Category created successfully",
				category,
				success: true,
			};
		} catch (error) {
			console.error("Error while creating category:", error);
			return {
				message: "Failed to create category",
				error,
				success: false,
			};
		}
	}
}

export default CategoryService;

class ApiFeatures {
    constructor(queryString, mongooseQuery) {
        this.queryString = queryString;
        this.mongooseQuery = mongooseQuery;
    }

    filter() {
        const filter = {};

        for (const [key, value] of Object.entries(this.queryString)) {
            // Handle operators like price[gte], price[lte]

            if (key.includes("[") && key.endsWith("]")) {
                const field = key.split("[")[0];
                const op = key.split("[")[1].replace(/.$/, "");

                if (!filter[field]) filter[field] = {};

                const validOperators = ["gte", "gt", "lte", "lt"];
                if (validOperators.includes(op)) {
                    filter[field][`$${op}`] = value;
                }
            } else {
                filter[key] = value;
            }
        }
        const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
        excludedFields.forEach((field) => delete filter[field]);
        this.mongooseQuery = this.mongooseQuery.find(filter);
        this.mongooseQuery.filter=  filter

        return this;
    }

    paginate(total) {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 10;
        const skip = (page - 1) * limit;

        this.pagination = {
            currentPage: page,
            limit,
            numberOfPages: Math.ceil(total / limit),
        };

        if (page * limit < total) this.pagination.next = page + 1;
        if (skip > 0) this.pagination.prev = page - 1;

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }

    sorting() {
        if (!this.queryString.sort) {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
            return this;
        }
        let sort = this.queryString.sort;
        console.log(sort);

        if (Array.isArray(sort)) sort = sort[sort.length - 1];

        const [sortField, sortDirection = "desc"] = sort.split(":");

        const allowedSortFields = ["price", "name", "ratingsAverage", "sold"];

        if (!allowedSortFields.includes(sortField)) {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
            return this;
        }

        // Convert to MongoDB sort format
        const sortOrder = sortDirection.toLowerCase() === "asc" ? 1 : -1;
        const sortOptions = {[sortField]: sortOrder};

        this.mongooseQuery = this.mongooseQuery.sort(sortOptions);

        return this;
    }

    limitFields() {
        if (!this.queryString.fields || !this.queryString) {
            this.mongooseQuery = this.mongooseQuery.select(
                "-__v -createdAt -updatedAt"
            );
            return this;
        }
        const fieldsArr = this.queryString.fields.split(",").join(" ");
        if (!/categor/gi.test(fieldsArr))
            this.mongooseQuery.setOptions({skipPopulate: true});

        this.mongooseQuery = this.mongooseQuery.select(fieldsArr);

        return this;
    }

    search(model) {
        const keyword = this.queryString.keyword;
        if (!keyword) return this;

        const searchConfig = {
            product: ["name", "description"],
            default: ["name"],
        };

        const fields = searchConfig[model] || searchConfig.default;

        const regex = {$regex: keyword, $options: "i"};
        const or = fields.map((f) => ({[f]: regex}));

        this.mongooseQuery = this.mongooseQuery.find({$or: or});

        return this;
    }
}

export default ApiFeatures;

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
        const operator = key.match(/\[(.*?)\]/)[1]; // Extract operator between []

        if (!filter[field]) {
          filter[field] = {};
        }

        // Supported MongoDB operators
        const validOperators = [
          "gte",
          "gt",
          "lte",
          "lt",
          "eq",
          "ne",
          "in",
          "nin",
        ];
        if (validOperators.includes(operator)) {
          filter[field][`$${operator}`] = isNaN(value) ? value : Number(value);
        }
      }
      // Handle simple equality queries
      else {
        filter[key] = isNaN(value) ? value : Number(value);
      }
    }

    const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
    excludedFields.forEach((field) => delete filter[field]);

    this.mongooseQuery = this.mongooseQuery.find(filter);
    return this;
  }

  Paginate(countDocuments) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const offset = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (offset > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(offset).limit(limit);
    this.pagination = pagination;
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      let { sort } = this.queryString;
      if (Array.isArray(sort)) {
        sort = sort[sort.length - 1];
      }
      const [sortField, sortDirection = "desc"] = sort.split(":");

      // Validate the sort field - use actual field names from Product model
      const allowedSortFields = [
        "price",
        "name",
        "createdAt",
        "ratingsAverage",
        "sold",
      ];

      if (!allowedSortFields.includes(sortField)) {
        // Skip invalid sort instead of throwing error to prevent breaking the query
        console.warn(`Invalid sort field: ${sortField}. Using default sort.`);
        this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        return this;
      }

      // Validate the sort direction
      if (!["asc", "desc"].includes(sortDirection.toLowerCase())) {
        console.warn(
          `Invalid sort direction: ${sortDirection}. Using default direction.`
        );
        this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        return this;
      }

      // Convert to MongoDB sort format
      const sortOrder = sortDirection.toLowerCase() === "asc" ? 1 : -1;
      const sortOptions = { [sortField]: sortOrder };

      this.mongooseQuery = this.mongooseQuery.sort(sortOptions);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString) {
      let selectedFields = [];
      if (this.queryString.fields) {
        const fieldsArr = this.queryString.fields.split(",").join(" ");
        selectedFields = this.queryString.fields.split(",");
        this.mongooseQuery = this.mongooseQuery.select(fieldsArr);
      } else {
        this.mongooseQuery = this.mongooseQuery.select(
          "-__v -createdAt -updatedAt"
        );
      }

      // Conditional Population - only populate if field is requested or no field selection
      if (!this.queryString.fields || selectedFields.includes("category")) {
        this.mongooseQuery = this.mongooseQuery.populate({
          path: "category",
          select: "name -_id",
          strictPopulate: false,
        });
      }

      if (
        !this.queryString.fields ||
        selectedFields.includes("subcategories")
      ) {
        this.mongooseQuery = this.mongooseQuery.populate({
          path: "subcategories",
          select: "name -_id",
          strictPopulate: false,
        });
      }
    }

    return this;
  }

  search(model) {
    if (this.queryString.keyword) {
      const query = {};
      if (model === "Product") {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}

export default ApiFeatures;

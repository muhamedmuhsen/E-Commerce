function buildFilter(query) {
  const filter = {};

  for (const [key, value] of Object.entries(query)) {
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

  const excludedFields = ["page", "limit", "sort", "fields"];
  excludedFields.forEach((field) => delete filter[field]);

  return filter;
}

export default buildFilter;

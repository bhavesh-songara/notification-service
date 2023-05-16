const mergeDataInHTML = (
  html: string,
  data: {
    [key: string]: string;
  }
): {
  html?: string;
  error?: string;
} => {
  const htmlValidation = /\{\{([a-z][a-zA-Z0-9]*)\}\}/g;

  const variables = html.match(htmlValidation);

  if (variables) {
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i].replace(/{{|}}/g, '');

      if (!data.hasOwnProperty(variable)) {
        return {
          error: `Variable ${variable} not found in data`
        };
      }
    }
  }

  html = html.replace(htmlValidation, (match, variable) => {
    return data[variable];
  });

  return {
    html
  };
};

export default mergeDataInHTML;

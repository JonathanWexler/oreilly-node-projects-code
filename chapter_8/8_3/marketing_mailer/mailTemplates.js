const htmlTemplate = (content) => {
  return `<html>
<body>
${content}
</body>
</html>`;
};
export const welcomeMail = () => {
  const content = ` <h1>Welcome to Inn Box!</h1>`;
  return htmlTemplate(content);
};

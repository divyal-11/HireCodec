FROM node:20-slim
RUN useradd -r -s /bin/false runner
RUN mkdir /sandbox && chown runner:runner /sandbox
WORKDIR /sandbox
USER runner
CMD ["node", "/sandbox/solution.js"]

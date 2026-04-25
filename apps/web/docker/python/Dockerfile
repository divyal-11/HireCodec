FROM python:3.12-slim
RUN useradd -r -s /bin/false runner
RUN mkdir /sandbox && chown runner:runner /sandbox
WORKDIR /sandbox
USER runner
CMD ["python", "/sandbox/solution.py"]

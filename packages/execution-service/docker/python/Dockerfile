FROM python:3.12-slim
RUN useradd -r -s /bin/false runner
RUN mkdir /sandbox && chown runner:runner /sandbox
RUN pip install --no-cache-dir numpy pandas
WORKDIR /sandbox
USER runner
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

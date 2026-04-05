FROM gcc:13-bookworm
RUN useradd -r -s /bin/false runner
RUN mkdir /sandbox && chown runner:runner /sandbox
WORKDIR /sandbox
USER runner
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

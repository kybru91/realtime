# ---- Build Stage ----
FROM elixir:1.11.4 AS app_builder

# Set environment variables for building the application
ENV MIX_ENV=prod \
    DB_SSL=false

RUN apt-get update

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Create the application build directory
RUN mkdir /app
WORKDIR /app


# Copy over all the necessary application files and directories
COPY ./server/config ./config
COPY ./server/lib ./lib
COPY ./server/priv ./priv
COPY ./server/mix.exs .
COPY ./server/mix.lock .

# Fetch the application dependencies and build the application
RUN mix deps.get
RUN mix deps.compile
RUN mix release


# ---- Application Stage ----
FROM debian:buster AS app

ENV LANG=C.UTF-8

# Install openssl
RUN apt-get update && \
    apt-get install -y openssl

# Copy over the build artifact from the previous step and create a non root user
# RUN adduser -D -h /home/app app
# WORKDIR /home/app
COPY --from=app_builder /app/_build .
COPY docker-entrypoint.sh .
# RUN chown -R app: ./prod
# USER app

ENTRYPOINT ["/docker-entrypoint.sh"]

# Run the Phoenix app
CMD ["./prod/rel/realtime/bin/realtime", "start"]

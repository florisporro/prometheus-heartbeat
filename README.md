# Prometheus Heartbeat Metrics

I wanted to track the current internet availability of hardware that may move around the world with Prometheus. Preferably without adding dedicated monitoring software or hardware to the system, so I needed something that will run on almost any linux-based system.

The solution was a very simple NodeJS server that listens for incoming heartbeats made with simple HTTP GET requests, with an authentication header.

curl is enough to perform this request, and using cron a task can be scheduled to perform such a request every minute or so from even the simplest hardware.

## Getting Started

```
git clone https://github.com/florisporro/Prometheus_Heartbeat.git
npm install
SECRET=yoursecrethere npm run
```

That's it! Server is now listening for incoming heartbeats on port 3000.

Try it out:
```
curl --header "x-secret: yoursecrethere" http://localhost:3000/heartbeat/weeeee

Followed by:

curl http://localhost:3000/metrics
```

## Deployment

A Docker image is available.

```
docker run -p 3000:3000 -e "SECRET=yoursecrethere" florisporro/prometheus-heartbeat
```

## Authors

* **Floris Porro** - *Initial work* - [florisporro](https://github.com/florisporro)
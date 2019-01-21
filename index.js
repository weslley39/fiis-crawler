'use strict';

const Hapi = require('hapi');
const cheerio = require('cheerio');
const requestPromise = require('request-promise');

const FIIS_URL = 'https://fiis.com.br';
const FUNDS_EXPLORER_URL = 'https://www.fundsexplorer.com.br';
const PREFIX = '/api'

const server = Hapi.server({
    port: process.env.PORT ||3010
});

server.route({
  method:'GET',
  path:'/equity-per-share',
  handler: async (request, h) => {

      return 'Running 🏃🏻‍♂️';
  }
});

server.route({
    method:'GET',
    path: `${PREFIX}/equity-per-share`,
    handler: async (request, reply) => {

        const { name } = request.query;
        let value;
        try {
          const html = await requestPromise(`${FIIS_URL}/${name}/?aba=indicadores`)
          const $ = cheerio.load(html);

          const tr = $('table tr').eq(11).text();
          const texts = tr.split('*');
          value = texts[0].match(/[0-9].*/g)[0];
        } catch (error) {
          value = `${name} NOT FOUND`
        }

        return { value };
    }
});

server.route({
  method:'GET',
  path: `${PREFIX}/last-income`,
  handler: async (request, reply) => {

      const { name } = request.query;
      let value;
      try {
        const html = await requestPromise(`${FUNDS_EXPLORER_URL}/funds/${name}`)
        const $ = cheerio.load(html);

        const carousel = $('#main-indicators-carousel .carousel-cell').eq(5).text();
        value = carousel.match(/[0-9].*/g)[0];
      } catch (error) {
        value = `${name} NOT FOUND`
      }

      return { value };
  }
});

// Start the server
const start =  async function() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log(`The magic happens on: ${server.info.uri}`,);
};

start();
FROM public.ecr.aws/x1u4e0v6/node:14.15.5-alpine3.13

WORKDIR /usr/src/app

COPY ./ /usr/src/app/

RUN npm install --production

EXPOSE 3000

USER node

CMD [ "bin/www" ]

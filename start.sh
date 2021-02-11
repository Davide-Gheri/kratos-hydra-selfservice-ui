if [ -f .env ]
then
  export $(cat .env | xargs)
fi

if ! command -v envsubst &> /dev/null
then
    echo "envsubst could not be found"
    exit 1
fi

TEMPLATE_DIR=config/
VOLUME_DIR=.ory/

for file in ${TEMPLATE_DIR}*; do
  filename=$(basename $file)
  destination=${VOLUME_DIR}${filename}

  envsubst < $file > $destination
done

exec docker-compose -f docker-compose.yml up

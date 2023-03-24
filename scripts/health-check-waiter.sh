#!/bin/bash

SH_SLEEP=1
SH_RETRIES=500

usage()
{
    cat << USAGE >&2
Usage:
    health-check-waiter [options]

Options:
    --user=USER       			User for base auth
    --password=PASSWORD       	Password for base auth
    --url=URL					Url with health check

USAGE
    exit 1
}

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        --user=*)
        HEALTH_CHECK_WAITER_USER="${1#*=}"
        shift 1
        ;;
        --password=*)
        HEALTH_CHECK_WAITER_PASSWORD="${1#*=}"
        shift 1
        ;;
        --url=*)
	   	HEALTH_CHECK_WAITER_URL="${1#*=}"
	   	shift 1
	   	;;
        --help)
        usage
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

USER=${HEALTH_CHECK_WAITER_USER}
PASSWORD=${HEALTH_CHECK_WAITER_PASSWORD}
URL=${HEALTH_CHECK_WAITER_URL}

while [ $SH_RETRIES -gt 0 ]; do
	sleep $SH_SLEEP
	result=$(curl -u ${USER}:${PASSWORD} ${URL})
	if [ $? -eq 0 ]; then
		exit 0
	fi
	echo "----------------------------------------------------------------------------------"
	SH_RETRIES=$(($SH_RETRIES-1))
done


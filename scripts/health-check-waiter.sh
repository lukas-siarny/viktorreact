#!/bin/bash

SH_SLEEP=1
SH_RETRIES=500

while [ $SH_RETRIES -gt 0 ]; do
	sleep $SH_SLEEP
	result=$(curl -u "admin:Lopaty123." "http://localhost:3000/api/maintenance/health")
	if [ $? -eq 0 ]; then
		exit 0
	fi
	echo "----------------------------------------------------------------------------------"
	SH_RETRIES=$(($SH_RETRIES-1))
done


watch:
	tsc-watch --onSuccess "node server/server.js"

watch-debug:
	tsc-watch --onSuccess "node --inspect server/server.js"

codegen: codegen-fetch

codegen-angular:
	# angular
	yes | ./node_modules/.bin/lb-sdk server/server.js codegen/api/angular

codegen-export:
	# def
	lb export-api-def > codegen/def.yaml
	cd codegen && \
		patch < def.patch

codegen-fetch: codegen-export
	# fetch
	cd codegen && \
		java -jar swagger-codegen-cli-2.2.3.jar generate -i def.yaml -l typescript-fetch -o api/fetch
	sed -i~ -e 's/XAny/any/g' codegen/api/fetch/api.ts
	find ./codegen/api/fetch -not -name api.ts -delete || true

codegen-ios: codegen-export
	# ios
	cd codegen && \
		java -jar swagger-codegen-cli-2.3.1.jar generate -l swift4 -i def.yaml -DresponseAs=RxSwift -o api/ios
	cd codegen/api/ios && \
		sed -i~ \
			-e 's/: Any\?/: Data?/g' \
			-e 's/: \[Any\]\?/: [Data]?/g' \
			-e 's/Any\.self/Data.self/g' \
			-e 's/\[Any\]\.self/[Data].self/g' \
			-e 's/XData/XAny/g' \
			SwaggerClient/Classes/Swaggers/Models/*.swift && \
		sed -i~ \
			-e 's/RequestBuilder<Any>/RequestBuilder<Data>/g' \
			-e 's/options: Any/options: Data/g' \
			SwaggerClient/Classes/Swaggers/APIs/*.swift && \
		perl -i -ne 's/\?([,\)])/? = nil\1/g if ~/public init\(/; print' SwaggerClient/Classes/Swaggers/Models/*.swift && \
		find . -name \*.swift~ -delete || true

codegen-android: codegen-export
	# android api
	cd codegen && \
		java -jar swagger-codegen-cli-2.3.1.jar generate -l java -i def.yaml -DuseRxJava2=true -Dlibrary=retrofit2 -DhideGenerationTimestamp=true -o api/android
	cd codegen/api/android && \
		sed -i~ \
			 -e 's/Observable<Void>/Observable<Response<Void>>/g' \
			 -e 's/import retrofit2.http.\*;/import retrofit2.http.*; import retrofit2.Response;/g' \
			src/main/java/io/swagger/client/api/*.java && \
		find . -name \*.java~ -delete || true

build:
	tsc
	docker-compose build
	docker push registry.ql6625.fr/fr_ql6625_mobilisation_api:2

up:
	node version.js up

down:
	node version.js down

deploy: build
	rsync -aP --no-o --no-g stack.yml dev@ql6625.fr:api.mobilisation.ql6625.fr/
	ssh dev@ql6625.fr 'cd api.mobilisation.ql6625.fr && docker stack deploy --with-registry-auth -c stack.yml fr_ql6625_mobilisation_api'

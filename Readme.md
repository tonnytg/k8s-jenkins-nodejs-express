# K8S with Jenkins

! If you running minikube for K8S cluster, I recommend use virtualbox driver, maybe by default you are using docker.
Try something like this, this will help you more easy work with network service:
> $minikube start --cpus 4 --memory 8048 --addons=ingress --vm=true

I used virtualbox, but dns kube-dns don't work as well, my applications don't connect each other, and then I change to docker than virtualbox.

## First steps

#### Pre-Req:
 - kubernetes cluster
 - kubectl binary
 - helm binary

#### Optional:
 - k9s

## Create a Jenkins

Create namespace for Jenkins
> $kubectl create namespace jenkins

Create a volume to Jenkins, this grant you don't lose data when some pod restart
Run this command root folder of this project, out of jenkins folder
> $helm install jenkins -n jenkins -f jenkins-values.yaml jenkinsci/jenkins

With this you have now a Jenkins inside a namespace jenkins to build your pipeline

## Create your app
Now you can deploy your app
> $kubectl create -f app-deployment.yaml

Now you can deploy your service for network
> $kubectl create -f app-service.yaml


## Check your application
> $kubectl get all

To check jenkins at another namespace
> $kubectn get all -n jenkins


## Access NodeJS port

You can check
> $echo http://$(minikube ip):$(kubectl get service | grep 'node-message' | tr -s " " | cut -d ":" -f2| cut -d"/" -f1)

> $minikube service list

You can run
> curl http:$(kubectl cluster-info | head -n1 | tr -s " " | cut -d":" -f2):$(kubectl get service | grep 'node-message' | tr -s " " | cut -d ":" -f2| cut -d"/" -f1)

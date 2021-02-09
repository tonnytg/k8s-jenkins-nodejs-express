# K8S with Jenkins

### What do you need?
- Minikube
- Docker
- kubectl
- Helm
- k9s (optional)

### Config Minikube

First you need to install and configure `minikube`
> minikube start --cpus 4 --memory 8048 --addons=ingress --vm=true
<br/>
  

## First steps after minikube running
  

#### Create a Jenkins

  
Create namespace for Jenkins

> kubectl create namespace jenkins

Go to k8s folder inside this project
> cd k8s
> helm install jenkins -n jenkins -f jenkins-values.yaml jenkinsci/jenkins

With this you have now a Jenkins inside a namespace jenkins to build your pipeline
Follow the instructions of `helm` output to get Jenkins admin password 
  

#### Create service NodePort for Jenkins

Inside k8s folder, deploy services for access jenkins
> kubectl create -f jenkins-service.yml -n jenkins

If you want check
> kubectl get svc -n jenkins

### Configure kubectl on Jenkins pod

```
kubectl exec -n jenkins -it $(kubectl get pods -n jenkins | tail -n1 | tr -s " " | cut -d" " -f1) -- bash
```
Go to home of jenkins and create a folder for kubectl config
> cd /var/jenkins_home

> mkdir .kube

Inside jenkins home, download kubect
```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

> chmod +x kubectl

At this momento your kubectl don't work, because you need key of k8s cluster.
<br/>


> kubectl cp ~/.minikube/ca.crt jenkins/jenkins-0:/var/jenkins_home/.kube/

> kubectl cp ~/.minikube/profiles/minikube/client.key jenkins/jenkins-0:/var/jenkins_home/.kube/

> kubectl cp ~/.minikube/profiles/minikube/client.crt jenkins/jenkins-0:/var/jenkins_home/.kube/

Exit jenkins pod and back your machine.

Now we need config file, but you need edit a PATH of files, create a copy of your config, edit and after send to jenkins.

In your machine, copy file
> cp ~/.kube/config ~/.kube/config-jenkins
<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/config%20user.png" width="600" height="500">

Edit file
> vim ~/.kube/config-jenkins

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/config%20jenkins.png" width="600" height="500">

Edit PATH of lines ca.crt, client.key and client.crt to /var/jenkins_home/
Now send this config-jenkins to POD

> kubectl cp ~/.kube/config-jenkins jenkins/jenkins-0:/var/jenkins_home/.kube/config



Nice!
Now your Jenkins ready to use kubectl

## Configure your jenkins web console

To access, follow next command to get URL and PORT:
```
echo "http://`minikube ip`:`kubectl get all -n jenkins | grep jenkins-service | tr -s " " | cut -d" " -f5 | cut -d":" -f2 | cut -d"/" -f1`"
```
Access this link on your browser.


#### To login:
User: admin
Password: To get password run this command.
```
kubectl exec --namespace jenkins -it svc/jenkins -c jenkins -- /bin/cat /run/secrets/chart-admin-password && echo
```
The password return like this:

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/jenkins%20password.png" width="1000" height="35">


## Configure your jenkins

1. Login
2. Create a **pipeline** with name `build app k8s`
3. Go to Pipeline and paste k8s/jenkinsfile content, like this image:

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/jenkinsfile.png" width="1000" height="850">

4. Save
5. Build yout test

Example of jobs working:

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/build%20pipeline.png" width="1000" height="300">




## Example aplication

1. First yout need deploy your database to listen 27017
2. After deploy your app in Nodejs to get some data on mongodb-service

<img src="https://github.com/tonnytg/k8s-jenkins-nodejs-express/blob/master/screenshots/check%20deploy%20dev_prod.png" width="1000" height="300">


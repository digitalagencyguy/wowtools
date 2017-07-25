from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.views.decorators.http import require_http_methods as route
from .utils import Response

@route(["GET"])
def apiTest(request):
	message = Response(request.POST)
	return HttpResponse(message)


@route(["POST"])
def details(request):
	message = Response(request.POST)
	return HttpResponse(message)

@route(["POST"])
def apiKey(request):
	message = Response(request.POST)
	return HttpResponse(message)

@route(["POST"])
def subscriptions(request):
	message = Response(request.POST)
	return HttpResponse(message)
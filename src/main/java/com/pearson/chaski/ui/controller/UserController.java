package com.pearson.chaski.ui.controller;

import javax.security.auth.login.LoginException;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.pearson.chaski.ui.controller.collections.CollectionController;
import com.pearson.chaski.ui.model.auth.User;
import com.pearson.chaski.ui.service.UserService;

@RequestMapping(value = "/user")
@Controller
public class UserController {
	private static final Logger LOG = LoggerFactory
					.getLogger(CollectionController.class);
	
	UserService userService;
	
	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody String createCollection(@RequestBody String body) throws JSONException, LoginException {
		//check if already exists
		LOG.debug("Requestbody"+body);
		JSONObject json = new JSONObject(body);
		String email = json.getString("email");
		User user = userService.getUserByEmail(email);
		if(user==null){
			throw new LoginException("Can not find your email address: "+email);
		}
		
		return "{\"response\":\"success\"}";
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}
}

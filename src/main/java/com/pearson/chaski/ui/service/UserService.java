package com.pearson.chaski.ui.service;

import com.pearson.chaski.ui.model.auth.User;

public interface UserService {
	public User getUser(String emailAddress);

	User getUserByEmail(String emailAddress);
}

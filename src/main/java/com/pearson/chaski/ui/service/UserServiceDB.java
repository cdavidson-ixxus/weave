package com.pearson.chaski.ui.service;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DaoSupport;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pearson.chaski.ui.model.auth.User;

@Service
@Transactional
public class UserServiceDB implements UserService {
	@Autowired
	private UserDao userDao;
	
	@Override
	public User getUserByEmail(String emailAddress) {
		// TODO Auto-generated method stub
		return userDao.getUserByEmail(emailAddress);
	}
	
	public UserDao getUserDao() {
		return userDao;
	}
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	@Override
	public User getUser(String emailAddress) {
		// TODO Auto-generated method stub
		return null;
	}
}

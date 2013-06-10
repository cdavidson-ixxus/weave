package com.pearson.chaski.ui.service;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.pearson.chaski.ui.model.auth.User;

/**
 * Testing user persistence within the db
 * @author Cdavidson
 *
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/datasource-context.xml")
public class UserDaoTest {
	@Autowired
	UserDao userDao;
	@Test
	@Transactional
	public void testCreateUser(){
		User user = new User();
		user.setUsername("chris");
		user.setEmailAddress("chris@ixxus.com");
		
		this.userDao.createUser(user);
	}
	
	@Test
	@Transactional
	public void testGetUser(){
		User user = new User();
		user.setUsername("chris");
		user.setEmailAddress("chris@ixxus.com");
		
		this.userDao.createUser(user);
		
		User createdUser = this.userDao.getUser("chris");
		assertEquals(user.getUsername(),createdUser.getUsername());
		assertEquals(user.getEmailAddress(),createdUser.getEmailAddress());
	}
	

	@Test
	@Transactional
	public void testGetUserByEmail(){
		User user = new User();
		user.setUsername("chris");
		user.setEmailAddress("chris@ixxus.com");
		
		this.userDao.createUser(user);
		
		User createdUser = this.userDao.getUserByEmail("chris@ixxus.com");
		assertEquals(user.getUsername(),createdUser.getUsername());
		assertEquals(user.getEmailAddress(),createdUser.getEmailAddress());
	}
	
	@Test
	@Transactional
	public void testGetAllUsers(){
		User user1 = new User();
		user1.setUsername("chris");
		user1.setEmailAddress("chris@ixxus.com");
		this.userDao.createUser(user1);
		
		User user2 = new User();
		user2.setUsername("evan");
		user2.setEmailAddress("evan@ixxus.com");
		this.userDao.createUser(user2);
		
		User user3 = new User();
		user3.setUsername("dan");
		user3.setEmailAddress("dan@ixxus.com");
		this.userDao.createUser(user3);
		
		List<User> users = this.userDao.getAllUsers();
		
		assertEquals(3, users.size());
		
		Set<String> allUsers = new HashSet<String>();
		allUsers.add("chris");
		allUsers.add("evan");
		allUsers.add("dan");

		for (Iterator iterator = allUsers.iterator(); iterator.hasNext();) {
			String user = (String) iterator.next();
			assertTrue("User not in returned list "+user,users.contains(user2));
		}
		
	
	}
}

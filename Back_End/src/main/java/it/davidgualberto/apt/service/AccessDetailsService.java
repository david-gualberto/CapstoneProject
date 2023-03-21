package it.davidgualberto.apt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.davidgualberto.apt.entities.User;
import it.davidgualberto.apt.models.AccessDetails;
import it.davidgualberto.apt.repository.UserRepo;

@Service
public class AccessDetailsService implements UserDetailsService {
	@Autowired
	UserRepo uR;
	
	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User u = uR.findUserByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("No User with Username '" + username + "' was Found."));
		return AccessDetails.build(u);
	}

}
